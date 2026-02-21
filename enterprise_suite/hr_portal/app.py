from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request

app = FastAPI()
templates = Jinja2Templates(directory="templates")

employees = []

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "employees": employees})

@app.post("/create")
def create_employee(name: str = Form(...), role: str = Form(...)):
    employees.append({"name": name, "role": role})
    return {"status": "Employee Created"}