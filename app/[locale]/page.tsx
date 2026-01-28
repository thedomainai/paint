"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCcw, Paintbrush, ChevronLeft, ChevronRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  MetaSection,
  GlobalContextSection,
  CompositionSection,
  ObjectsSection,
  JsonPreview,
  ImagePreview,
  WorkflowStepper,
  WORKFLOW_STEPS,
  usePromptBuilder,
} from "@/features/prompt-builder";

export default function HomePage() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);

  const {
    prompt,
    updateMeta,
    updateGlobalContext,
    updateLighting,
    updateColorPalette,
    updateComposition,
    addObject,
    updateObject,
    removeObject,
    duplicateObject,
    resetPrompt,
    loadPrompt,
  } = usePromptBuilder();

  // Calculate step completion
  const stepsWithCompletion = WORKFLOW_STEPS.map((step) => ({
    ...step,
    isComplete:
      step.id === "meta"
        ? !!prompt.meta.image_type
        : step.id === "context"
          ? !!prompt.global_context.scene_description
          : step.id === "composition"
            ? !!prompt.composition.camera_angle
            : prompt.objects.length > 0,
  }));

  const handleNext = () => {
    if (currentStep < WORKFLOW_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <MetaSection meta={prompt.meta} onUpdate={updateMeta} />;
      case 1:
        return (
          <GlobalContextSection
            globalContext={prompt.global_context}
            onUpdate={updateGlobalContext}
            onUpdateLighting={updateLighting}
            onUpdateColorPalette={updateColorPalette}
          />
        );
      case 2:
        return (
          <CompositionSection
            composition={prompt.composition}
            onUpdate={updateComposition}
          />
        );
      case 3:
        return (
          <ObjectsSection
            objects={prompt.objects}
            onAdd={addObject}
            onUpdate={updateObject}
            onRemove={removeObject}
            onDuplicate={duplicateObject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Paintbrush className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">
                {t("header.title")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={resetPrompt}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("common.reset")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel - Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Workflow Stepper */}
            <div className="bg-card rounded-xl border p-6">
              <WorkflowStepper
                steps={stepsWithCompletion}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Current Section */}
            <div className="animate-in fade-in-50 duration-300">
              {renderCurrentSection()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("common.previous")}
              </Button>

              <div className="flex items-center gap-2">
                {WORKFLOW_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStep === WORKFLOW_STEPS.length - 1}
              >
                {t("common.next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="lg:sticky lg:top-20 space-y-6">
              <ImagePreview prompt={prompt} />
              <JsonPreview prompt={prompt} onLoad={loadPrompt} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          {t("footer.description")}
        </div>
      </footer>
    </div>
  );
}
