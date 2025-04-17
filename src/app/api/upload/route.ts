import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { uploadImage } from "@/lib/uploadImage";


export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const uploadResult = await uploadImage(formData);
		console.log("uploadResult", uploadResult)
		return NextResponse.json(uploadResult, { status: 201 });
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error }, { status: 500 });
	}
}