# A very simple Flask Hello World app for you to get started with...
import json
import numpy as np
from joblib import load
from flask import Flask
from flask import request
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)

mapping = {0: 'Армяне',
           1: 'Азербайджанцы',
           2: 'Татары и башкиры',
           3: 'Белорусы, русские и украинцы',
           4: 'Буряты',
           5: 'Чеченцы, дагестанцы и ингуши',
           6: 'Грузины',
           7: 'Евреи',
           8: 'Адыгейцы, балкарцы, кабардинцы и карачаевцы',
           9: 'Калмыки',
           10: 'Казахи и киргизы',
           11: 'Молдоване',
           12: 'Таджики и узбеки',
           13: 'Тувинцы',
           14: 'Якуты'}

mapping_full = {0: 'Армяне',
                1: 'Азербайджанцы',
                2: 'Башкиры',
                3: 'Белорусы',
                4: 'Буряты',
                5: 'Чеченцы',
                6: 'Дагестанцы',
                7: 'Грузины',
                8: 'Ингуши',
                9: 'Евреи',
                10: 'Кабардинцы и адыгейцы',
                11: 'Калмыки',
                12: 'Карачаевцы и балкарцы',
                13: 'Казахи',
                14: 'Киргизы',
                15: 'Молдаване',
                16: 'Осетины',
                17: 'Русские',
                18: 'Таджики',
                19: 'Татары',
                20: 'Тувинцы',
                21: 'Украинцы',
                22: 'Узбеки',
                23: 'Якуты'}

ethnos = list(mapping.values())
ethnos_full = list(mapping_full.values())
app = Flask(__name__)
CORS(app)
clf = load('models/aggregated_classes_model.pkl')
clf_full = load('models/all_classes_model.pkl')


@app.route('/get_proba', methods=['GET', 'POST'])
def proba():
    if request.method == 'POST':
        content = request.json
        name = np.array([f"{content['firstName']} {content['lastName']}"])
        proba = clf.predict_proba(np.array(name))
        proba = proba.reshape(15, )
        ans = dict(zip(ethnos, proba))

        return json.dumps(ans)
    else:
        return 405


@app.route('/get_proba_full', methods=['GET', 'POST'])
def proba_full():
    if request.method == 'POST':
        content = request.json
        name = np.array([f"{content['firstName']} {content['lastName']}"])
        proba = clf_full.predict_proba(np.array(name))
        proba = proba.reshape(24, )
        ans = dict(zip(ethnos_full, proba))

        return json.dumps(ans)
    else:
        return 405


if __name__ == "__main__":
    app.run()
