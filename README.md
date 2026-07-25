# Bone-Fracture-Detection 
AI-assisted upper-limb fracture detection using YOLOv8 with a web-based application.
# Overview
This project was developed as a three-member bachelor's graduation project.
The system applies a YOLOv8s object detection model to identify and localize six upper-limb fracture categories in X-ray images. The trained model was integrated into a web-based prototype that displays predicted fracture classes, bounding boxes, and confidence scores.
# My Contributions
This repository contains the complete graduation project developed by a three-member team.
My primary responsibilities in this project included:
- Processing and remapping YOLO-format annotations
- Preparing training, validation, and test datasets
- Configuring and training the YOLOv8s model
- Monitoring the training process and model convergence
- Evaluating model performance using precision, recall, mAP, and confusion matrices
- Supporting the integration of the trained model into the web-based prototype
# Key Features
- Detection and localization of six upper-limb fracture categories
- Bounding-box visualization with confidence scores
- X-ray image upload and prediction workflow
- Web-based interface for viewing detection results
- Model evaluation using precision, recall, and mean Average Precision
# Fracture Categories
The final model was trained to detect the following six categories:
1. Elbow positive
2. Fingers positive
3. Forearm fracture
4. Humerus fracture
5. Shoulder fracture
6. Wrist positive
# Dataset
- Total cleaned dataset: 2,060 X-ray images
- Training set: 1,648 images
- Validation set: 206 images
- Test set: 206 images
- Data split: 80% training, 10% validation, and 10% testing
- Annotation format: YOLO bounding-box format
# Model Configuration
- Model: YOLOv8s
- Pretrained weights: COCO pretrained model
- Input image size: 640 × 640
- Training epochs: 100
- Batch size: 16
- Optimizer: AdamW
- Learning rate: 0.001
- Training environment: Google Colab
- GPU: NVIDIA Tesla T4
# Artificial Intelligence
- Python
- PyTorch
- Ultralytics YOLOv8
- OpenCV
- Roboflow
- Google Colab
# Web Application
- ASP.NET Core
- React
- TypeScript
- SQL Server
- Flask
