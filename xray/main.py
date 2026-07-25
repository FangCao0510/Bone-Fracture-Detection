from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import os
import uuid

app = FastAPI()
model = YOLO("best.pt")  # Hoặc yolov8n.pt
LABEL_TRANSLATIONS = {
    "elbow positive": "Gãy khuỷu tay",
    "fingers positive": "Gãy ngón tay",
    "forearm fracture": "Gãy xương cẳng tay",
    "humerus": "Gãy xương cánh tay – xương cánh trên",
    "shoulder fracture": "Gãy vai",
    "wrist positive": "Gãy cổ tay",
}

# RESULT_DIR = r"D:\Documents\Code\xray\Results"
# os.makedirs(RESULT_DIR, exist_ok=True)  # Tạo thư mục nếu chưa tồn tại

class PredictionRequest(BaseModel):
    id: str
    image_path: str  # Đường dẫn tới file ảnh (trên máy server)

@app.post("/predict/")
async def predict(req: PredictionRequest):
    if not os.path.isfile(req.image_path):
        return JSONResponse(
            content={"error": "Image path not found"},
            status_code=400
        )
    results = model(req.image_path)[0]
    file_ext = os.path.splitext(req.image_path)[-1]
    output_filename = f"{req.id}_{uuid.uuid4().hex}{file_ext}"
    #output_path = os.path.join( output_filename)
    output_dir = os.path.dirname(req.image_path)
    output_path = os.path.join(output_dir, output_filename)
    results.save(filename=output_path)
    output_rel = os.path.basename(output_path)
    prediction_texts = []
    for box in results.boxes:
        cls_id = int(box.cls[0])
        label = model.names.get(cls_id, f"class_{cls_id}")
        vn_label = LABEL_TRANSLATIONS.get(label, label)
        prediction_texts.append(f"{vn_label}")
        # conf = float(box.conf[0])
        # prediction_texts.append(f"{label}")

    prediction_text = ", ".join(prediction_texts) if prediction_texts else "No object detected"
    return {
        "id": req.id,
        "image_path": req.image_path,
        "prediction_text": prediction_text,
        # "diagnostic_image_path": output_path.replace("\\", "/")
        "diagnostic_image_path": output_rel
    }
