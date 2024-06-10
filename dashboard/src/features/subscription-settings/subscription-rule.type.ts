export type SubscriptionRuleResultType =
    "xray" | "v2ray" | "sing-box" | "clash" | "clash-meta" | "block" | "links" | "base64-links" | "template"

export type SubscriptionRuleType = {
    pattern: string,
    result: SubscriptionRuleResultType
}

export type SubscriptionSettingsType = {
    url_prefix: string;
    profile_title: string;
    support_link: string;
    update_interval: number;
    rules: SubscriptionRuleType[];
}
