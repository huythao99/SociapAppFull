from flask import Flask, request, jsonify
import pickle
import numpy as np
from utilities import text_preprocess

clf = pickle.load(open('./model/naive_bayes.pkl', 'rb'))

# print a nice greeting.
def say_hello(username = "World"):
    return '<p>Hello %s!</p>\n' % username

# some bits of text for the page.
header_text = '''
    <html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
instructions = '''
    <p><em>Hint</em>: This is a RESTful web serviceeeeee! Append a username
    to the URL (for example: <code>/Thelonious</code>) to say hello to
    someone specific.</p>\n'''
home_link = '<p><a href="/">Back</a></p>\n'
footer_text = '</body>\n</html>'

# EB looks for an 'application' callable by default.
application = Flask(__name__)

# add a rule for the index page.
application.add_url_rule('/', 'index', (lambda: header_text +
    say_hello() + instructions + footer_text))

# add a rule when the page is accessed with a name appended to the site

@application.route('/predict', methods=['POST'])
def predict():
   data = request.get_json(force=True)
   new_data = list(data.values())
   text = text_preprocess(new_data[0])
   prediction = clf.predict([text])
   return jsonify(prediction[0])
# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    # application.run(host='0.0.0.0', port=8080)
    application.debug = True
    application.run()