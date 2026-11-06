export type MarketingSnippet = {
  id: string;
  name: string;
  provider: 'facebook' | 'gtm' | 'tiktok' | 'hotjar' | 'custom';
  scriptBody: string;
  placement: 'beforeInteractive' | 'afterInteractive';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export const marketingProviders = ['facebook', 'gtm', 'tiktok', 'hotjar', 'custom'] as const;
export type MarketingActionState = { status: number; message: string };
