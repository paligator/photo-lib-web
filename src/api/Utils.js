
import EXIF from 'exif-js';

export async function getExif(img) {
	const exif = await new Promise((resolve): void => {
		EXIF.getData(img, function () {
			var exif = {
				DateTime: EXIF.getTag(this, "DateTime") || "",
				Orientation: EXIF.getTag(this, "Orientation"),
				Camera: `${EXIF.getTag(this, "Make") || ""} ${EXIF.getTag(this, "Model") || ""}`.trim()
			}
			resolve(exif);
		});
	});

	return exif;
}
