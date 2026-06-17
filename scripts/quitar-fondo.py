# Quita el fondo de los frames del cohete con IA (rembg / u2net).
# Uso: python scripts/quitar-fondo.py
# Entrada:  %TEMP%/cohete_in/*.png   Salida: %TEMP%/cohete_out/*.png (con alfa)
import glob
import os

from PIL import Image
from rembg import new_session, remove

temp = os.environ["TEMP"]
entrada = sorted(glob.glob(os.path.join(temp, "cohete_in", "*.png")))
salida_dir = os.path.join(temp, "cohete_out")
os.makedirs(salida_dir, exist_ok=True)

sesion = new_session("u2net")

for i, ruta in enumerate(entrada, 1):
    img = Image.open(ruta).convert("RGB")
    resultado = remove(img, session=sesion)
    resultado.save(os.path.join(salida_dir, os.path.basename(ruta)))
    if i % 40 == 0:
        print(f"{i}/{len(entrada)} frames")

print(f"listo: {len(entrada)} frames procesados")
