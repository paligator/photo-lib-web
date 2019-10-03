
import EXIF from 'exif-js';

export async function getExif(img) {
	const exif = await new Promise((resolve): void => {
		EXIF.getData(img, function () {
			var exif = {
				DateTime: EXIF.getTag(this, "DateTime") || "",
				// Orientation: EXIF.getTag(this, "Orientation"),
				Camera: `${EXIF.getTag(this, "Make") || ""} ${EXIF.getTag(this, "Model") || ""}`.trim(),
				// FNumber: EXIF.getTag(this, "FNumber"),
				// ExposureTime: EXIF.getTag(this, "ExposureTime"),
				// ExposureProgram: EXIF.getTag(this, "ExposureProgram"),
				// ISOSpeedRatings: EXIF.getTag(this, "ISOSpeedRatings"),
				// ApertureValue: EXIF.getTag(this, "ApertureValue"),
				// BrightnessValue: EXIF.getTag(this, "BrightnessValue"),
				// LightSource: EXIF.getTag(this, "LightSource"),
				// Flash: EXIF.getTag(this, "Flash"),
				// FocalLength: EXIF.getTag(this, "FocalLength"),
				// WhiteBalance: EXIF.getTag(this, "WhiteBalance"),
				// DigitalZoomRation: EXIF.getTag(this, "DigitalZoomRation"),
				GPSLatitude: EXIF.getTag(this, "GPSLatitude"),
				GPSLongtitude: EXIF.getTag(this, "GPSLongtitude")
			}
			resolve(exif);
		});
	});

	return exif;
}
