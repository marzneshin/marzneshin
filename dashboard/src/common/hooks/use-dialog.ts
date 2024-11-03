import { useState } from "react";
export const useDialog = (open = false) => useState<boolean>(open);
