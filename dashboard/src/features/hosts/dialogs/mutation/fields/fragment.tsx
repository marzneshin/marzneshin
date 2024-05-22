import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Button,
} from "@marzneshin/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import { useDialog } from "@marzneshin/hooks";
import { TrashIcon } from "lucide-react";

export const FragmentPopover: FC = () => {
	const { t } = useTranslation();
	const form = useFormContext();
	const [popover, setPopover] = useDialog();
	const fragment: any | null | undefined = form.getValues().fragment;

	const handleApply = () => {
		const lengthValid = /[\d-]{1,32}/.test(fragment?.length);
		const intervalValid = /[\d-]{1,32}/.test(fragment?.interval);
		const packetsValid = /(:?tlshello|[\d-]{1,32})/.test(fragment?.packets);

		if (lengthValid && packetsValid && intervalValid) {
			form.setValue("fragment", fragment, {
				shouldValidate: true,
				shouldTouch: true,
				shouldDirty: true,
			});
			setPopover(false);
		}
	};

	return (
		<Popover open={popover} onOpenChange={setPopover}>
			<PopoverTrigger
				onClick={(e) => {
					e.preventDefault();
					setPopover(true);
				}}
				className="flex flex-row w-full"
			>
				{fragment ? (
					<>
						<div className="border rounded-s-lg p-2 w-full">
							{fragment.packets}
						</div>
						<div className="border  w-full p-2">{fragment.length}</div>
						<div className="border  w-full rounded-e-lg p-2">
							{fragment.interval}
						</div>
					</>
				) : (
					<div className="border rounded-lg p-2 w-full">{t("disabled")}</div>
				)}
			</PopoverTrigger>
			<PopoverContent>
				<FormField
					name="fragment.packets"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("page.hosts.fragment.packets")}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="fragment.length"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("page.hosts.fragment.length")}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="fragment.interval"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("page.hosts.fragment.interval")}</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button onClick={handleApply}>Apply</Button>
			</PopoverContent>
		</Popover>
	);
};

export const FragmentField = () => {
	const { t } = useTranslation();
	const form = useFormContext();
	const fragment = form.getValues().fragment;
	const disabled = fragment === undefined || fragment === null;
	const disable = () => {
		form.setValue("fragment", null, {
			shouldValidate: true,
			shouldTouch: true,
			shouldDirty: true,
		});
	};
	return (
		<FormField
			control={form.control}
			name="fragment"
			render={() => (
				<FormItem className="my-2 w-full">
					<FormLabel className="flex flex-row justify-between items-center">
						{t("fragment")}
						{!disabled && (
							<Button
								variant="destructive"
								className="p-0 size-5 bg-primary-background"
								onClick={(e) => {
									e.preventDefault();
									disable();
								}}
							>
								<TrashIcon className="text-red-400" />
							</Button>
						)}
					</FormLabel>
					<FormControl>
						<FragmentPopover />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
