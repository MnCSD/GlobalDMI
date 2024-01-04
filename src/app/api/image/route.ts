import exifr from "exifr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams.get("data"));

  const exif = await exifr.parse(
    "https://github.com/ianare/exif-samples/blob/master/jpg/gps/DSCN0012.jpg?raw=true"
  );

  return new NextResponse(JSON.stringify(exif), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
