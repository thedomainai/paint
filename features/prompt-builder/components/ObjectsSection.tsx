"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, Layers, User, Shirt, ImageIcon } from "lucide-react";
import type { PromptObject } from "../types/prompt";
import { ObjectEditor } from "./ObjectEditor";
import { SectionCard } from "./ui";

interface ObjectsSectionProps {
  objects: PromptObject[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<PromptObject>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function ObjectsSection({
  objects,
  onAdd,
  onUpdate,
  onRemove,
  onDuplicate,
}: ObjectsSectionProps) {
  const t = useTranslations("objects");
  const tc = useTranslations("common");
  const ts = useTranslations("sections");

  const QUICK_ADD_TEMPLATES = [
    { label: t("person"), icon: User },
    { label: t("apparel"), icon: Shirt },
    { label: t("graphic"), icon: ImageIcon },
  ];

  return (
    <SectionCard icon={Layers} title={ts("objects")}>
      {/* Quick add buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_ADD_TEMPLATES.map((template) => (
          <Button
            key={template.label}
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="gap-1"
          >
            <template.icon className="w-4 h-4" />
            {template.label}
          </Button>
        ))}
        <Button onClick={onAdd} size="sm" className="gap-1 ml-auto">
          <Plus className="h-4 w-4" />
          {tc("add")}
        </Button>
      </div>

      {/* Objects list */}
      <div className="space-y-4">
        {objects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {t("noObjects")}
            </p>
            <Button onClick={onAdd} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {t("addObject")}
            </Button>
          </div>
        ) : (
          objects.map((obj, index) => (
            <div key={obj.id} className="relative pl-6">
              <div className="absolute left-0 top-4 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                {index + 1}
              </div>
              <ObjectEditor
                object={obj}
                onUpdate={(updates) => onUpdate(obj.id, updates)}
                onRemove={() => onRemove(obj.id)}
                onDuplicate={() => onDuplicate(obj.id)}
              />
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
