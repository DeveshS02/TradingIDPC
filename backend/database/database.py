from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = 'sqlite:///./trading_app.db'

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False},
    pool_size=20,          # Increase pool size from default 5 to 20
    max_overflow=30,       # Increase overflow from default 10 to 30
    pool_timeout=30,       # Wait up to 30 seconds for a connection
    pool_recycle=1800,     # Recycle connections after 30 minutes
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
