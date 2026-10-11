
import logging
import time
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import engine, Base
from models import Payment, Transaction, FraudLog
from routers.payments import router as payment_router
from routers.dashboard import router as dashboard_router
from routers.statements import router as statement_router


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("api.monitoring")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Credit Card Payment System - Payment API",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_request_metrics(request: Request, call_next):
    request_id = str(uuid4())
    start = time.perf_counter()
    status_code = 500

    try:
        response = await call_next(request)
        status_code = response.status_code
        response.headers["X-Request-ID"] = request_id
        return response
    except Exception:
        logger.exception(
            "request_failed request_id=%s method=%s path=%s",
            request_id,
            request.method,
            request.url.path,
        )
        raise
    finally:
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        level = logging.ERROR if status_code >= 500 else logging.INFO
        logger.log(
            level,
            "request_complete request_id=%s method=%s path=%s "
            "status=%s duration_ms=%s",
            request_id,
            request.method,
            request.url.path,
            status_code,
            duration_ms,
        )


@app.get("/")
def root():
    return {"message": "Payment API is running"}


@app.get("/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "service": "payment-api",
            "database": "connected",
        }
    except SQLAlchemyError:
        logger.exception("health_check_failed")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "payment-api",
                "database": "disconnected",
            },
        )


app.include_router(payment_router)
app.include_router(dashboard_router)
app.include_router(statement_router)
