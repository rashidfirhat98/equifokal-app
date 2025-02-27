import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MultiSelectInput from "./MultiSelectInput";

export default function GalleryForm() {
  return (
    <Card className="mx-3">
      <CardHeader>
        <CardTitle>Create a gallery</CardTitle>
        <CardDescription>
          Add a photos from your bucket to create a gallery here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Gallery title</Label>
          <Input id="current" type="text" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="current">Select photos</Label>
          <MultiSelectInput />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save gallery</Button>
      </CardFooter>
    </Card>
  );
}
