"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/actions/posts";
import { getAllCategories, addCategory } from "@/actions/categories";
import QuillEditor from "./QuillEditor";
import MediaPickerModal from "./MediaPickerModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import StatusPill from "./StatusPill";
import { Post } from "@/types/post";
import { useLoading } from "./LoadingProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, ChevronLeft, ChevronDown, Check, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface PostFormProps {
    post?: Post;
    mode: "create" | "edit";
    user?: { name?: string | null } | null;
    categories: string[];
}

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    author: z.string(),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    content: z.any(),
    banner: z.string().optional(),
    published: z.boolean(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    ogImage: z.string().optional(),
});

export default function PostForm({ post, mode, user, categories: masterCategories }: PostFormProps) {
    const router = useRouter();
    const { startTransition } = useLoading();

    // Form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: post?.frontmatter.title || "",
            description: post?.frontmatter.description || "",
            author: post?.frontmatter.author || user?.name || "Admin Paroki",
            categories: post?.frontmatter.categories || [],
            content: post?.content || { ops: [] },
            banner: post?.frontmatter.banner || "",
            published: post?.frontmatter.published || false,
            metaTitle: post?.frontmatter.metaTitle || "",
            metaDescription: post?.frontmatter.metaDescription || "",
            metaKeywords: Array.isArray(post?.frontmatter.metaKeywords)
                ? post?.frontmatter.metaKeywords.join(", ")
                : post?.frontmatter.metaKeywords || "",
            ogImage: post?.frontmatter.ogImage || "",
        },
    });

    const [categoryInput, setCategoryInput] = useState("");
    const [existingCategories, setExistingCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBannerPicker, setShowBannerPicker] = useState(false);
    const [showOgImagePicker, setShowOgImagePicker] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Watch values for UI updates
    const watchedCategories = form.watch("categories");
    const watchedBanner = form.watch("banner");
    const watchedOgImage = form.watch("ogImage");
    const watchedPublished = form.watch("published");
    const watchedTitle = form.watch("title");

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };
        if (showCategoryDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showCategoryDropdown]);

    // Fetch categories for suggestions
    useEffect(() => {
        setLoadingCategories(true);
        getAllCategories()
            .then(setExistingCategories)
            .finally(() => setLoadingCategories(false));
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>, publishStatus?: boolean) => {
        // Validation check for empty content
        const hasContent = values.content &&
            (typeof values.content === 'string' ? values.content.trim() !== "" :
                values.content.ops && values.content.ops.length > 0);

        if (!hasContent) {
            setError("Content is required.");
            return;
        }

        // Override published status if provided
        const finalPublished = publishStatus !== undefined ? publishStatus : values.published;

        startTransition(async () => {
            setSaving(true);
            setError(null);

            // Logic to auto-save new categories if entered
            for (const cat of values.categories) {
                // Normalize for check
                const normalized = cat.trim();
                const exists = existingCategories.some(existing => existing.toLowerCase() === normalized.toLowerCase());
                if (!exists) {
                    await addCategory(normalized);
                }
            }

            const data = {
                ...values,
                description: values.description || "",
                content: values.content,
                published: finalPublished,
            };

            const result = mode === "create"
                ? await createPost(data)
                : await updatePost(post!.frontmatter.slug, data);

            setSaving(false);

            if (result.success) {
                router.push("/admin/posts");
                router.refresh();
            } else {
                setError(result.error || "Failed to save post");
            }
        });
    };

    // Wrapper for Save/Publish buttons to force submit
    const handleSaveAction = (publish: boolean) => {
        form.setValue("published", publish);
        form.handleSubmit((values) => onSubmit(values, publish))();
    };

    const handleDelete = () => {
        if (!post) return;
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!post) return;
        startTransition(async () => {
            setSaving(true);
            const result = await deletePost(post.frontmatter.slug);
            if (result.success) {
                router.push("/admin/posts");
                router.refresh();
            } else {
                setError(result.error || "Failed to delete post");
                setSaving(false);
                setShowDeleteModal(false);
            }
        });
    };

    const addCategoryItem = (cat: string) => {
        const trimmed = cat.trim();
        const currentCategories = form.getValues("categories");
        // Case-insensitive duplicate check
        const exists = currentCategories.some(c => c.toLowerCase() === trimmed.toLowerCase());

        if (trimmed && !exists) {
            form.setValue("categories", [...currentCategories, trimmed]);
        }
        setCategoryInput("");
    };

    const removeCategoryItem = (cat: string) => {
        const currentCategories = form.getValues("categories");
        form.setValue("categories", currentCategories.filter((c) => c !== cat));
    };

    return (
        <Form {...form}>
            <form className="min-h-screen relative pb-20">
                {/* Sticky Header with Actions */}
                <div className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-4 mb-8 border-b flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="gap-2"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div className="flex items-center gap-3">
                            <StatusPill published={watchedPublished} />
                            <h2 className="text-xl font-bold text-gray-800">
                                {mode === "create" ? "Create New Post" : `Editing: ${watchedTitle}`}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {mode === "edit" && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={saving}
                            >
                                Delete
                            </Button>
                        )}

                        <div className="flex items-center rounded-md shadow-sm">
                            <Button
                                type="button"
                                onClick={() => handleSaveAction(true)}
                                disabled={saving}
                                className="rounded-r-none border-r border-primary-foreground/20"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (watchedPublished ? "Update" : "Publish")}
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="rounded-l-none px-2"
                                        disabled={saving}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-[200px] p-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full justify-start font-normal"
                                        onClick={() => handleSaveAction(false)}
                                    >
                                        Save as Draft
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full justify-start font-normal"
                                        onClick={() => {
                                            const cats = form.getValues("categories");
                                            // Ensure we grab the first one and kebab-case it
                                            const category = (cats.length > 0 ? cats[0].trim().toLowerCase().replace(/\s+/g, '-') : 'lainnya');
                                            const title = form.getValues("title");
                                            const slug = post?.frontmatter.slug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null);

                                            if (slug) {
                                                window.open(`/artikel/${category}/${slug}`, '_blank');
                                            } else {
                                                alert("Please enter a title to preview.");
                                            }
                                        }}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        Preview
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        {error && (
                            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
                                {error}
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <QuillEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="relative">
                        <div className="sticky top-[100px] space-y-6">
                            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider border-b pb-2">
                                    Post Settings
                                </h3>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Post Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter title here..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Short summary..." rows={3} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Categories */}
                                    <div className="space-y-2">
                                        <Label>Categories</Label>
                                        <p className="text-[10px] text-muted-foreground">
                                            The first category will be used as the primary URL channel.
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {watchedCategories.map((cat) => (
                                                <Badge key={cat} variant="secondary" className="gap-1">
                                                    {cat}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCategoryItem(cat)}
                                                        className="rounded-full hover:bg-muted p-0.5 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="relative" ref={categoryDropdownRef}>
                                            <Input
                                                value={categoryInput}
                                                onFocus={() => setShowCategoryDropdown(true)}
                                                onChange={(e) => {
                                                    setCategoryInput(e.target.value);
                                                    setShowCategoryDropdown(true);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addCategoryItem(categoryInput);
                                                        setShowCategoryDropdown(false);
                                                    }
                                                }}
                                                placeholder="Add category..."
                                            />

                                            {showCategoryDropdown && (
                                                <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-48 overflow-y-auto">
                                                    {loadingCategories ? (
                                                        <div className="p-2 text-center text-xs text-muted-foreground">
                                                            Searching...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {existingCategories
                                                                .filter(cat =>
                                                                    !watchedCategories.includes(cat) &&
                                                                    cat.toLowerCase().includes(categoryInput.toLowerCase())
                                                                )
                                                                .map(cat => (
                                                                    <button
                                                                        key={cat}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            addCategoryItem(cat);
                                                                            setShowCategoryDropdown(false);
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                                                                    >
                                                                        <span>{cat}</span>
                                                                    </button>
                                                                ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="author"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Author</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider border-b pb-2">
                                    Featured Image
                                </h3>
                                <div className="space-y-3">
                                    {watchedBanner ? (
                                        <div className="relative group rounded-md overflow-hidden border h-32">
                                            <Image
                                                src={watchedBanner}
                                                alt="Banner"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => form.setValue("banner", "")}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setShowBannerPicker(true)}
                                            className="h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground text-sm hover:border-primary hover:text-primary cursor-pointer transition-colors bg-muted/50"
                                        >
                                            <ImageIcon className="h-8 w-8 mb-1" />
                                            Select Image
                                        </div>
                                    )}

                                    {watchedBanner && (
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="w-full h-auto p-0"
                                            onClick={() => setShowBannerPicker(true)}
                                        >
                                            Replace Image
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider border-b pb-2">
                                    SEO Settings
                                </h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="metaTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Leave empty to use post title" {...field} />
                                                </FormControl>
                                                <p className="text-[10px] text-muted-foreground">Recommended: 50-60 characters</p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="metaDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Leave empty to use post description" rows={3} {...field} />
                                                </FormControl>
                                                <p className="text-[10px] text-muted-foreground">Recommended: 150-160 characters</p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="metaKeywords"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta Keywords</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <Label>Open Graph Image</Label>
                                        {watchedOgImage ? (
                                            <div className="relative group rounded-md overflow-hidden border h-32">
                                                <Image
                                                    src={watchedOgImage}
                                                    alt="OG Image"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => form.setValue("ogImage", "")}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setShowOgImagePicker(true)}
                                                className="h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground text-sm hover:border-primary hover:text-primary cursor-pointer transition-colors bg-muted/50"
                                            >
                                                <ImageIcon className="h-8 w-8 mb-1" />
                                                Select OG Image
                                            </div>
                                        )}
                                        {watchedOgImage && (
                                            <Button
                                                type="button"
                                                variant="link"
                                                size="sm"
                                                className="w-full h-auto p-0"
                                                onClick={() => setShowOgImagePicker(true)}
                                            >
                                                Replace Image
                                            </Button>
                                        )}
                                        <p className="text-[10px] text-muted-foreground">Leave empty to use banner image</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <MediaPickerModal
                    isOpen={showBannerPicker}
                    onClose={() => setShowBannerPicker(false)}
                    onSelect={(path) => {
                        form.setValue("banner", path);
                        setShowBannerPicker(false);
                    }}
                    initialTab="banner"
                />
                <MediaPickerModal
                    isOpen={showOgImagePicker}
                    onClose={() => setShowOgImagePicker(false)}
                    onSelect={(path) => {
                        form.setValue("ogImage", path);
                        setShowOgImagePicker(false);
                    }}
                    initialTab="banner"
                />
                <DeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Post"
                    message={`Are you sure you want to delete "${watchedTitle}"? This action cannot be undone and the post will be permanently removed from the website.`}
                    loading={saving}
                />
            </form>
        </Form>
    );
}
