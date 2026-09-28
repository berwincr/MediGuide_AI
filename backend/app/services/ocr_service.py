import pytesseract

from PIL import (
    Image,
    ImageEnhance,
    ImageFilter,
    ImageOps
)


# --------------------------------------------------
# TESSERACT PATH
# --------------------------------------------------

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# --------------------------------------------------
# IMAGE PREPROCESSING
# --------------------------------------------------

def preprocess_image(image):

    image = image.convert("L")

    image = ImageOps.exif_transpose(image)

    image = ImageOps.autocontrast(image)

    image = image.resize(
        (
            image.width * 2,
            image.height * 2
        )
    )

    image = ImageEnhance.Contrast(
        image
    ).enhance(1.5)

    image = ImageEnhance.Sharpness(
        image
    ).enhance(2)

    image = image.filter(
        ImageFilter.SHARPEN
    )

    return image


# --------------------------------------------------
# OCR USING MULTIPLE PAGE SEGMENTATION MODES
# --------------------------------------------------

def extract_text(
    image_path: str,
    language: str = "eng"
):

    image = Image.open(image_path)

    processed_image = preprocess_image(
        image
    )

    results = []

    # PSM 3:
    # Automatic page segmentation
    try:

        text = pytesseract.image_to_string(
            processed_image,
            lang=language,
            config="--psm 3"
        )

        if text.strip():
            results.append(text)

    except Exception as error:

        print(
            "OCR PSM 3 Error:",
            error
        )

    # PSM 6:
    # Assume a uniform block of text
    try:

        text = pytesseract.image_to_string(
            processed_image,
            lang=language,
            config="--psm 6"
        )

        if text.strip():
            results.append(text)

    except Exception as error:

        print(
            "OCR PSM 6 Error:",
            error
        )

    # PSM 11:
    # Sparse text
    try:

        text = pytesseract.image_to_string(
            processed_image,
            lang=language,
            config="--psm 11"
        )

        if text.strip():
            results.append(text)

    except Exception as error:

        print(
            "OCR PSM 11 Error:",
            error
        )

    # --------------------------------------------------
    # COMBINE OCR RESULTS
    # --------------------------------------------------

    combined_lines = []

    seen = set()

    for result in results:

        for line in result.splitlines():

            line = line.strip()

            if not line:
                continue

            normalized = " ".join(
                line.lower().split()
            )

            if normalized in seen:
                continue

            seen.add(normalized)

            combined_lines.append(line)

    return "\n".join(
        combined_lines
    ).strip()