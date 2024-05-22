import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@marzneshin/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const AlpnField = () => {
	const { t } = useTranslation();
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name="alpn"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>{t("alpn")}</FormLabel>
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Select ALPN" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectItem value="none">None</SelectItem>
							<SelectItem value="h2">h2</SelectItem>
							<SelectItem value="http/1.1">HTTP 1.1</SelectItem>
							<SelectItem value="h2,http/1.1"> H2 HTTP 1.1</SelectItem>
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
