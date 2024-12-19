import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@marzneshin/common/components";
import type { FieldErrors, FieldError } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Copy, MailWarning, TrashIcon } from "lucide-react";
import { useState } from "react";
import type { FC } from "react";

interface NoiseForm {
  noise: Array<{
    length: string;
    packets: string;
    interval: string;
  } | null>;
}

const NoiseErrorPopover: FC<{
  errors?: { packets?: FieldError; length?: FieldError; interval?: FieldError };
}> = ({ errors }) => {
  const { t } = useTranslation();

  if (!errors || (!errors.packets && !errors.length && !errors.interval))
    return null;

  return (
    <Popover>
      <PopoverTrigger>
        <MailWarning className="p-0 size-5 text-destructive bg-primary-background" />
      </PopoverTrigger>
      <PopoverContent className="bg-destructive-accent text-sm">
        <ul className="my-6 ml-3 list-disc [&>li]:mt-1 mt-0">
          {errors.length?.message && (
            <li>
              <b>Length:</b> {t(errors.length.message as string)}
            </li>
          )}
          {errors.packets?.message && (
            <li>
              <b>Packets:</b> {t(errors.packets.message as string)}
            </li>
          )}
          {errors.interval?.message && (
            <li>
              <b>Interval:</b> {t(errors.interval.message as string)}
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export const NoiseField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  const [forms, setForms] = useState<NoiseForm["noise"][number][]>([]);

  const errors = form.formState.errors as FieldErrors<NoiseForm>;

  const addForm = () => {
    if (forms.length < 5) {
      const newForms = [...forms, { length: "", packets: "", interval: "" }];
      setForms(newForms);
      form.setValue("noise", newForms, { shouldValidate: true });
    }
  };

  const removeForm = (index: number) => {
    const updatedForms = forms.filter((_, i) => i !== index);
    setForms(updatedForms);
    form.setValue("noise", updatedForms, { shouldValidate: true });
  };

  const enableForm = (index: number) => {
    const updatedForms = [...forms];
    updatedForms[index] = { length: "", packets: "", interval: "" };
    setForms(updatedForms);
    form.setValue("noise", updatedForms, { shouldValidate: true });
  };

  return (
    <div>
      {forms.length > 0 ? (
        forms.map((formData, index) => (
          <FormItem key={index} className="my-2 w-full">
            {index === 0 && (
              <FormLabel className="flex flex-row justify-between items-center">
                {t("Noise")}
                <div className="flex flex-row items-center gap-2">
                  {errors.noise?.[index] && (
                    <NoiseErrorPopover errors={errors.noise[index]} />
                  )}
                  {forms.length < 5 && (
                    <Button
                      variant="default"
                      className="p-0 size-5 bg-primary-background"
                      onClick={(e) => {
                        e.preventDefault();
                        addForm();
                      }}
                    >
                      <Copy className="text-black" />
                    </Button>
                  )}
                </div>
              </FormLabel>
            )}
            <FormControl>
              <div className="flex flex-row w-full items-center gap-2">
                {formData ? (
                  <>
                    <FormField
                      name={`noise.${index}.packets`}
                      render={({ field }) => (
                        <Input
                          className="border rounded-none rounded-s-lg p-2 w-full"
                          {...field}
                        />
                      )}
                    />
                    <FormField
                      name={`noise.${index}.length`}
                      render={({ field }) => (
                        <Input className="rounded-none w-full p-2" {...field} />
                      )}
                    />
                    <FormField
                      name={`noise.${index}.interval`}
                      render={({ field }) => (
                        <Input
                          className="border w-full rounded-none rounded-e-lg p-2"
                          {...field}
                        />
                      )}
                    />
                    <Button
                      variant="destructive"
                      className="p-0 size-5 bg-primary-background"
                      onClick={(e) => {
                        e.preventDefault();
                        removeForm(index);
                      }}
                    >
                      <TrashIcon className="text-red-400" />
                    </Button>
                  </>
                ) : (
                  <Button
                    className="border w-full"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      enableForm(index);
                    }}
                  >
                    {t("Enable Form")}
                  </Button>
                )}
              </div>
            </FormControl>
          </FormItem>
        ))
      ) : (
        <FormItem className="my-2 w-full">
          <FormLabel className="flex flex-row justify-between items-center">
            {t("Noise")}
          </FormLabel>

          <Button
            className="border w-full"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              addForm();
            }}
          >
            {t("disabled")}
          </Button>
        </FormItem>
      )}
    </div>
  );
};
