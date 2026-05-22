import pandas as pd

from sklearn.tree import DecisionTreeClassifier

from sklearn.preprocessing import LabelEncoder

import joblib


# LOAD DATASET
data = pd.read_csv("dataset.csv")


# INPUT FEATURES
X = data[["accuracy", "avgTime", "skipRate"]]


# OUTPUT LABELS
y = data["difficulty"]


# ENCODE LABELS
encoder = LabelEncoder()

y_encoded = encoder.fit_transform(y)


# CREATE MODEL
model = DecisionTreeClassifier()


# TRAIN MODEL
model.fit(X, y_encoded)


# SAVE MODEL
joblib.dump(model, "difficulty_model.pkl")

joblib.dump(encoder, "label_encoder.pkl")



print("Model trained successfully!")