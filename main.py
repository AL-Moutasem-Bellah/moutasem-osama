from fastapi import FastAPI
from database import create_db_and_tables, get_session
import models  # مهم حتى يعرف الجداول
from pydantic import BaseModel
from typing import Optional
from models import  Book
from sqlmodel import select



app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def pla_pla():
    return{"ana":"moutasem"}

###__CREATE BOOK___
class Bookcreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    keywords: Optional[str] = None
    category: str

@app.post("/create-book")
def create_book(book_in : Bookcreate):
    session = get_session()
    try:
        book = Book(
        title= book_in.title,
        author= book_in.author,
        description= book_in.description,
        keywords= book_in.keywords,
        category= book_in.category,

    )
        session.add(book)
        session.commit()
        session.refresh (book)
        return book
    finally:
        session.close()

##SHOW ALL BOOKS

@app.get("/books")
def get_books():
    session = get_session()
    try:
        books = session.exec(select(Book)).all()
        return books
    finally:
        session.close()

##SEARCH OF BOOK

@app.get("/books/search")
def search_book(query : str):
    session = get_session()
    try:
        statement = select(Book).where(
           (Book.title.contains(query))|
           (Book.author.contains(query))|
           (Book.keywords.contains(query))|
           (Book.id.contains(query))
        )
        result = session.exec(statement).all()
        return result
    finally:
        session.close()

##UBDATE BOOK

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    category: Optional[str] = None

@app.put("/books/{book_id}")
def update_book(book_id :int, book_in : BookUpdate):
    session = get_session()
    try:
        book = session.get(Book, book_id)
        if not book:
            return {"error": "Book not found"}
        if book_in.title is not None:
            book.title = book_in.title
        if book_in.author is not None:
            book.author = book_in.author
        if book_in.description is not None:
            book.description = book_in.description
        if book_in.keywords is not None:
            book.keywords = book_in.keywords
        if book_in.category is not None:
            book.category = book_in.category

            session.add(book)
            session.commit()
            session.refresh(book)
            return book
    finally:
        session.close()

##DELETE BOOK

@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    session = get_session()
    try:
        book = session.get(Book, book_id)
        if not book:
            return {"error" : " Book not found"}
        session.delete(book)
        session.commit()
        return{"massage": "Book deleted successfully"}
    finally:
        session.close()