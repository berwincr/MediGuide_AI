import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_text(image_path: str, language: str = "eng"):

    image = Image.open(image_path)

    text = pytesseract.image_to_string(
        image,
        lang=language,
        config="--psm 6"
    )

    return text.strip()