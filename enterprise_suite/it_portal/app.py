from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request

app = FastAPI()
templates = Jinja2Templates(directory="templates")

accounts = []

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "accounts": accounts})

@app.post("/create")
def create_account(name: str = Form(...)):
    accounts.append({"name": name})
    return {"status": "IT Account Created"}