import openai
from flask import Flask, request, jsonify, render_template
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

app = Flask(__name__)

openai.api_key = "replace_with_your_openai_api_key"

def parse_instruction(instruction):
    functions = [
        {
            "name": "extract_website_browser",
            "description": "Extracts the website and browser names from natural language instructions.",
            "parameters": {
                "type": "object",
                "properties": {
                    "website": {"type": "string", "description": "The name of the website to open."},
                    "browser": {"type": "string", "description": "The name of the browser to use."}
                },
                "required": ["website", "browser"]
            }
        }
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an assistant that extracts website and browser names."},
            {"role": "user", "content": instruction}
        ],
        functions=functions,
        function_call={"name": "extract_website_browser"}  
    )

    function_args = response["choices"][0]["message"]["function_call"]["arguments"]

    import json
    parsed_data = json.loads(function_args)
    
    print("Structured Output:", parsed_data)  
    return parsed_data
 

def open_website(website, browser):
    try:
        if "http" not in website:
            website = f"http://{website}.com"

        driver = None
        if browser.lower() == "chrome":
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        elif browser.lower() == "firefox":
            driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))
        elif browser.lower() == "safari":
            driver = webdriver.Safari()
        else:
            return f"Browser '{browser}' is not supported."

        driver.get(website)

        return f"Opened {website} in {browser}."
    except Exception as e:
        return str(e)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/open', methods=['POST'])
def open_url():
    data = request.json
    instruction = data.get('instruction')
    if not instruction:
        return jsonify({"error": "Instruction is required"}), 400

    try:
        parsed_data = parse_instruction(instruction)
        website = parsed_data.get("website")
        browser = parsed_data.get("browser")

        if website and browser:
            result = open_website(website, browser)
            return jsonify({"message": result})
        else:
            return jsonify({"error": "Could not parse the instruction correctly."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
