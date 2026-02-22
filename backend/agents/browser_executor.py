import multiprocessing
from playwright.sync_api import sync_playwright


# generic browser executor that can be called for any agent type with appropriate payload
def _run_in_separate_process(agent_type: str, payload: dict):

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False, slow_mo=300)
            page = browser.new_page()

            # Route to correct automation
            if agent_type == "hr":
                _run_hr_flow(page, payload)

            elif agent_type == "it":
                _run_it_flow(page, payload)

            elif agent_type == "procurement":
                _run_proc_flow(page, payload)

            else:
                print(f"Unknown agent type: {agent_type}")

            print(f"{agent_type.upper()} automation finished.")
            browser.close()

    except Exception as e:
        print(f"Browser Process Error ({agent_type}): {e}")


# Hr workflow
def _run_hr_flow(page, payload):

    page.goto("http://127.0.0.1:3001")
    page.wait_for_selector("#employee_name")

    page.wait_for_timeout(2000)
    page.fill("#employee_name", payload["name"])

    page.wait_for_timeout(2000)
    page.fill("#employee_role", payload["role"])

    page.wait_for_timeout(2000)
    page.click("#submit_btn")


# it workflow
def _run_it_flow(page, payload):

    page.goto("http://127.0.0.1:3002")
    page.wait_for_selector("#it_employee_name")

    page.wait_for_timeout(2000)
    page.fill("#it_employee_name", payload["name"])

    page.wait_for_timeout(2000)
    page.click("#it_submit_btn")


# procurement workflow
def _run_proc_flow(page, payload):

    page.goto("http://127.0.0.1:3003")
    page.wait_for_selector("#proc_employee_name")
    
    page.wait_for_timeout(2000)
    page.fill("#proc_employee_name", payload["name"])
    
    page.wait_for_selector("#laptop_model")

    options = page.locator("#laptop_model option").all_text_contents()
    print("AVAILABLE OPTIONS:", options)
    print("REQUESTED OPTION:", payload["laptop_model"])
    
    page.wait_for_timeout(2000)
    page.click("#laptop_model")
    page.select_option("#laptop_model", value=payload["laptop_model"])

    page.wait_for_timeout(1000)

    page.click("#proc_submit_btn")


# public entrypoint for executing any browser-based agent

def execute_browser_agent(agent_type: str, payload: dict):

    p = multiprocessing.Process(
        target=_run_in_separate_process,
        args=(agent_type, payload)
    )

    p.start()
    p.join()