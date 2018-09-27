from flask import Flask , render_template, request
import pandas as pd
import os
import numpy as np
import json


app = Flask(__name__, static_url_path='/static')

APP_ROOT = os.path.dirname(os.path.abspath(__file__))   # refers to application_top
csvfolderpath = os.path.join(APP_ROOT, 'OutputFolder')
@app.route('/test')
def test():
    files = os.listdir(csvfolderpath)
    return render_template('index.html', files=files, fileName='')

@app.route('/home')
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/gethistdata')
def first(): 
    train_df = pd.read_csv("Input/test.csv")
    train_df_re = train_df['de'].tolist()
    dict_data = dict(data=train_df_re)
    return json.dumps(dict_data), 200


if __name__ == '__main__':
    app.run(debug=True)
