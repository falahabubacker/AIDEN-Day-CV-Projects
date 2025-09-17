from flask import Flask
from flask import render_template

# Create a Flask application instance
app = Flask(__name__)

# Define a route for the root URL ("/")
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/balls")
def ball_catcher():
    return render_template("ball_catch/index.html")

@app.route("/body")
def body_pose():
    return render_template("body_pose/index.html")

@app.route("/paint")
def paint():
    return render_template("hand_paint/index.html")

@app.route("/color_paint")
def color_paint():
    return render_template("hand_color_paint/index.html")

@app.route("/magnets")
def magnets():
    return render_template("interactive_fridge_magnets/index.html")

# Run the application if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True, ssl_context='adhoc') # debug=True enables auto-reloading and a debugger