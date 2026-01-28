"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2, Copy } from "lucide-react";
import type { PromptObject, ObjectCategory } from "../types/prompt";

const CATEGORIES: ObjectCategory[] = [
  "Person",
  "Apparel",
  "Footwear",
  "Accessory",
  "Illustration/Overlay",
  "Illustration/Background Element",
  "Digital Vector",
  "Prop",
  "Environment",
  "Other",
];

interface ObjectEditorProps {
  object: PromptObject;
  onUpdate: (updates: Partial<PromptObject>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function ObjectEditor({
  object,
  onUpdate,
  onRemove,
  onDuplicate,
}: ObjectEditorProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {object.id}
          </span>
          <Input
            value={object.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Object label"
            className="w-48"
          />
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={object.category}
            onValueChange={(value) =>
              onUpdate({ category: value as ObjectCategory })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <Select
            value={object.dimensions_relative}
            onValueChange={(value) =>
              onUpdate({
                dimensions_relative: value as "Small" | "Medium" | "Large",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small">Small</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Distance from Camera</Label>
          <Select
            value={object.distance_from_camera}
            onValueChange={(value) =>
              onUpdate({
                distance_from_camera: value as PromptObject["distance_from_camera"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Close">Close</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Far">Far</SelectItem>
              <SelectItem value="Zero (Overlay)">Zero (Overlay)</SelectItem>
              <SelectItem value="Behind Subject">Behind Subject</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {/* Location */}
        <AccordionItem value="location">
          <AccordionTrigger>Location & Bounding Box</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <Label>Relative Position</Label>
              <Input
                value={object.location.relative_position}
                onChange={(e) =>
                  onUpdate({
                    location: {
                      ...object.location,
                      relative_position: e.target.value,
                    },
                  })
                }
                placeholder="e.g., Center, Upper Left"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>X Position ({Math.round(object.location.bounding_box_percentage.x * 100)}%)</Label>
                <Slider
                  value={[object.location.bounding_box_percentage.x]}
                  onValueChange={([x]) =>
                    onUpdate({
                      location: {
                        ...object.location,
                        bounding_box_percentage: {
                          ...object.location.bounding_box_percentage,
                          x,
                        },
                      },
                    })
                  }
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="space-y-2">
                <Label>Y Position ({Math.round(object.location.bounding_box_percentage.y * 100)}%)</Label>
                <Slider
                  value={[object.location.bounding_box_percentage.y]}
                  onValueChange={([y]) =>
                    onUpdate({
                      location: {
                        ...object.location,
                        bounding_box_percentage: {
                          ...object.location.bounding_box_percentage,
                          y,
                        },
                      },
                    })
                  }
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="space-y-2">
                <Label>Width ({Math.round(object.location.bounding_box_percentage.width * 100)}%)</Label>
                <Slider
                  value={[object.location.bounding_box_percentage.width]}
                  onValueChange={([width]) =>
                    onUpdate({
                      location: {
                        ...object.location,
                        bounding_box_percentage: {
                          ...object.location.bounding_box_percentage,
                          width,
                        },
                      },
                    })
                  }
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="space-y-2">
                <Label>Height ({Math.round(object.location.bounding_box_percentage.height * 100)}%)</Label>
                <Slider
                  value={[object.location.bounding_box_percentage.height]}
                  onValueChange={([height]) =>
                    onUpdate({
                      location: {
                        ...object.location,
                        bounding_box_percentage: {
                          ...object.location.bounding_box_percentage,
                          height,
                        },
                      },
                    })
                  }
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Material & Surface */}
        <AccordionItem value="surface">
          <AccordionTrigger>Material & Surface</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Material</Label>
                <Input
                  value={object.material}
                  onChange={(e) => onUpdate({ material: e.target.value })}
                  placeholder="e.g., Leather, Cotton, Digital Vector"
                />
              </div>
              <div className="space-y-2">
                <Label>Reflectivity</Label>
                <Select
                  value={object.surface_properties.reflectivity}
                  onValueChange={(value) =>
                    onUpdate({
                      surface_properties: {
                        ...object.surface_properties,
                        reflectivity: value as "None" | "Low" | "Medium" | "High",
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Texture</Label>
              <Input
                value={object.surface_properties.texture}
                onChange={(e) =>
                  onUpdate({
                    surface_properties: {
                      ...object.surface_properties,
                      texture: e.target.value,
                    },
                  })
                }
                placeholder="e.g., Smooth, Rough, Woven"
              />
            </div>
            <div className="space-y-2">
              <Label>Micro Details</Label>
              <Textarea
                value={object.surface_properties.micro_details}
                onChange={(e) =>
                  onUpdate({
                    surface_properties: {
                      ...object.surface_properties,
                      micro_details: e.target.value,
                    },
                  })
                }
                placeholder="Fine details visible on the surface..."
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color">
          <AccordionTrigger>Color Details</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>Base Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={object.color_details.base_color_hex}
                    onChange={(e) =>
                      onUpdate({
                        color_details: {
                          ...object.color_details,
                          base_color_hex: e.target.value,
                        },
                      })
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={object.color_details.base_color_hex}
                    onChange={(e) =>
                      onUpdate({
                        color_details: {
                          ...object.color_details,
                          base_color_hex: e.target.value,
                        },
                      })
                    }
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gradient/Pattern</Label>
              <Input
                value={object.color_details.gradient_or_pattern}
                onChange={(e) =>
                  onUpdate({
                    color_details: {
                      ...object.color_details,
                      gradient_or_pattern: e.target.value,
                    },
                  })
                }
                placeholder="e.g., Solid, Striped, Gradient"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pose/Orientation */}
        <AccordionItem value="pose">
          <AccordionTrigger>Pose & Orientation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label>Pose/Orientation</Label>
              <Textarea
                value={object.pose_orientation}
                onChange={(e) => onUpdate({ pose_orientation: e.target.value })}
                placeholder="Describe the pose or orientation..."
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
