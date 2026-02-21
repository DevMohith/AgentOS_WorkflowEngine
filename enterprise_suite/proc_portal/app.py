from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

orders = []

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "orders": orders
    })

@app.post("/order")
def order_equipment(
    name: str = Form(...),
    laptop_model: str = Form(...)
):
    order = {
        "name": name,
        "laptop_model": laptop_model,
        "status": "Pending Manager Approval"
    }
    orders.append(order)
    return {"status": "Order Placed"}