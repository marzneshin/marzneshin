import {
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  Input,
  FormField,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const NameField = () => {
  const form = useFormContext();
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("name")}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
