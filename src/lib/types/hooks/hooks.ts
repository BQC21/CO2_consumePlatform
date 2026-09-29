export type UseListResult<T> = {
    items: T[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

export type UseMutationsResult<TForm, TItem> = {
    loading: boolean;
    error: string | null;
    create: (form: TForm) => Promise<TItem>;
    update: (id: string, form: TForm) => Promise<TItem>;
    remove: (id: string) => Promise<void>;
};