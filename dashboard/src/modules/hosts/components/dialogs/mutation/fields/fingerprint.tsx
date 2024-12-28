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
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FingerprintField = () => {
	const { t } = useTranslation();
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name="fingerprint"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>{t("fingerprint")}</FormLabel>
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Select fingerprint" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectItem value="none">None</SelectItem>
							<SelectItem value="chrome">Chrome</SelectItem>
							<SelectItem value="firefox">Firefox</SelectItem>
							<SelectItem value="safari">Safari</SelectItem>
							<SelectItem value="ios">iOS</SelectItem>
							<SelectItem value="android">Android</SelectItem>
							<SelectItem value="edge">Edge</SelectItem>
							<SelectItem value="360">360</SelectItem>
							<SelectItem value="qq">qq</SelectItem>
							<SelectItem value="random">Random</SelectItem>
							<SelectItem value="randomized">Randomized</SelectItem>
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
