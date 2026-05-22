import sys

import joblib

import numpy as np


# LOAD TRAINED MODEL
model = joblib.load("difficulty_model.pkl")

encoder = joblib.load("label_encoder.pkl")


# GET INPUTS
accuracy = float(sys.argv[1])

avg_time = float(sys.argv[2])

skip_rate = float(sys.argv[3])


# PREPARE INPUT
X = np.array([[accuracy, avg_time, skip_rate]])


# PREDICT
prediction = model.predict(X)


# CONVERT LABEL
difficulty = encoder.inverse_transform(prediction)


print(difficulty[0])