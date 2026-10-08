from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from models import Payment
from routers.payments import router as payment_router
from routers.dashboard import router as dashboard_router
from routers.statements import router as statement_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Credit Card Payment System - Payment API",
    version="1.0.0"
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

app.include_router(payment_router)
app.include_router(dashboard_router)
app.include_router(statement_router)

@app.get("/")
def root():
    return {"message": "Payment API is running"}
