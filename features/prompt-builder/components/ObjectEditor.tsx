"use client";

import { useTranslations } from "next-intl";
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
import { Trash2, Copy, X, ImageIcon } from "lucide-react";
import type { PromptObject, ObjectCategory, ReferenceImage } from "../types/prompt";

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

const SIZE_OPTIONS = ["Small", "Medium", "Large"] as const;
const DISTANCE_OPTIONS = ["Close", "Mid", "Far", "Zero (Overlay)", "Behind Subject"] as const;
const REFLECTIVITY_OPTIONS = ["None", "Low", "Medium", "High"] as const;

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
  const t = useTranslations("objects");
  const tc = useTranslations("common");
  const to = useTranslations("options");

  // Get translated label for the current value
  const getCategoryLabel = (value: string) => to(`objectCategories.${value}`);
  const getSizeLabel = (value: string) => to(`objectSizes.${value}`);
  const getDistanceLabel = (value: string) => to(`objectDistances.${value}`);
  const getReflectivityLabel = (value: string) => to(`reflectivity.${value}`);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(",")[1];
      const referenceImage: ReferenceImage = {
        data: base64Data,
        mimeType: file.type,
        name: file.name,
      };
      onUpdate({ reference_image: referenceImage });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onUpdate({ reference_image: undefined });
  };

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
            placeholder={t("objectLabel")}
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

      {/* Reference Image Upload */}
      <div className="space-y-2">
        <Label>{t("referenceImage")}</Label>
        {object.reference_image ? (
          <div className="relative inline-block">
            <img
              src={`data:${object.reference_image.mimeType};base64,${object.reference_image.data}`}
              alt="Reference"
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-24">
              {object.reference_image.name}
            </p>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
            <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">{tc("upload")}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{t("category")}</Label>
          <Select
            value={object.category}
            onValueChange={(value) =>
              onUpdate({ category: value as ObjectCategory })
            }
          >
            <SelectTrigger>
              <SelectValue>{getCategoryLabel(object.category)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("size")}</Label>
          <Select
            value={object.dimensions_relative}
            onValueChange={(value) =>
              onUpdate({
                dimensions_relative: value as "Small" | "Medium" | "Large",
              })
            }
          >
            <SelectTrigger>
              <SelectValue>{getSizeLabel(object.dimensions_relative)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {getSizeLabel(size)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("distanceFromCamera")}</Label>
          <Select
            value={object.distance_from_camera}
            onValueChange={(value) =>
              onUpdate({
                distance_from_camera: value as PromptObject["distance_from_camera"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue>{getDistanceLabel(object.distance_from_camera)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {DISTANCE_OPTIONS.map((distance) => (
                <SelectItem key={distance} value={distance}>
                  {getDistanceLabel(distance)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {/* Location */}
        <AccordionItem value="location">
          <AccordionTrigger>{t("locationBoundingBox")}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("relativePosition")}</Label>
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
                placeholder={t("relativePositionPlaceholder")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("xPosition")} ({Math.round(object.location.bounding_box_percentage.x * 100)}%)</Label>
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
                <Label>{t("yPosition")} ({Math.round(object.location.bounding_box_percentage.y * 100)}%)</Label>
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
                <Label>{t("width")} ({Math.round(object.location.bounding_box_percentage.width * 100)}%)</Label>
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
                <Label>{t("height")} ({Math.round(object.location.bounding_box_percentage.height * 100)}%)</Label>
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
          <AccordionTrigger>{t("materialSurface")}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("material")}</Label>
                <Input
                  value={object.material}
                  onChange={(e) => onUpdate({ material: e.target.value })}
                  placeholder={t("materialPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("reflectivity")}</Label>
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
                    <SelectValue>{getReflectivityLabel(object.surface_properties.reflectivity)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {REFLECTIVITY_OPTIONS.map((ref) => (
                      <SelectItem key={ref} value={ref}>
                        {getReflectivityLabel(ref)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("texture")}</Label>
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
                placeholder={t("texturePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("microDetails")}</Label>
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
                placeholder={t("microDetailsPlaceholder")}
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color">
          <AccordionTrigger>{t("colorDetails")}</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>{t("baseColor")}</Label>
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
              <Label>{t("gradientPattern")}</Label>
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
                placeholder={t("gradientPatternPlaceholder")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pose/Orientation */}
        <AccordionItem value="pose">
          <AccordionTrigger>{t("poseOrientation")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label>{t("poseOrientation")}</Label>
              <Textarea
                value={object.pose_orientation}
                onChange={(e) => onUpdate({ pose_orientation: e.target.value })}
                placeholder={t("posePlaceholder")}
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
