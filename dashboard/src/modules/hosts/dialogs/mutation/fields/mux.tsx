import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	Checkbox,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const MuxField = () => {
	const { t } = useTranslation();
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name="mux"
			render={({ field }) => (
				<>
					<FormLabel>{t("mux")}</FormLabel>

					<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
						<FormControl>
							<Checkbox
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>{t("page.hosts.mux.title")}</FormLabel>
							<FormDescription>{t("page.hosts.mux.desc")}</FormDescription>
						</div>
					</FormItem>
				</>
			)}
		/>
	);
};
