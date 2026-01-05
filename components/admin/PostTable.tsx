"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePost } from "@/actions/posts";
import { PostMetadata } from "@/types/post";
import StatusPill from "./StatusPill";
import { useRouter } from "next/navigation";
import { useLoading } from "./LoadingProvider";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Filter, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostTableProps {
  posts: PostMetadata[];
  hidePagination?: boolean;
}

export default function PostTable({ posts, hidePagination = false }: PostTableProps) {
  const { startTransition } = useLoading();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string>("5");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(posts.flatMap(p => p.categories || []))).filter(Boolean).sort();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || (post.categories?.includes(categoryFilter));

    if (statusFilter === "all") return matchesSearch && matchesCategory;
    if (statusFilter === "published") return matchesSearch && matchesCategory && post.published;
    if (statusFilter === "draft") return matchesSearch && matchesCategory && !post.published;

    return matchesSearch && matchesCategory;
  });

  const effectiveItemsPerPage = itemsPerPage === "all" ? filteredPosts.length : parseInt(itemsPerPage);
  const totalPages = Math.ceil(filteredPosts.length / effectiveItemsPerPage);

  const paginatedPosts = itemsPerPage === "all"
    ? filteredPosts
    : filteredPosts.slice((currentPage - 1) * effectiveItemsPerPage, currentPage * effectiveItemsPerPage);

  const handleItemsPerPageChange = (val: string) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handleDelete = async (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      startTransition(async () => {
        setIsDeleting(slug);
        const result = await deletePost(slug);

        if (result.success) {
          router.refresh();
        } else {
          alert("Failed to delete post: " + result.error);
          setIsDeleting(null);
        }
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-b">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : paginatedPosts.map((post) => {
              const displayCategories = post.categories || [];
              const firstCategory = displayCategories[0] || "Uncategorized";
              const otherCategoriesCount = displayCategories.length > 1 ? displayCategories.length - 1 : 0;
              const otherCategoriesTitle = displayCategories.slice(1).join(", ");

              return (
                <TableRow key={post.slug}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/posts/${post.slug}/edit`} className="hover:underline">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusPill published={post.published} />
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="capitalize">
                        {firstCategory.replace("-", " ")}
                      </Badge>
                      {otherCategoriesCount > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary" className="text-xs h-5 px-1 cursor-help">
                                +{otherCategoriesCount}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{otherCategoriesTitle}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(post.publishedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              <Link
                                href={`/artikel/${firstCategory.toLowerCase().replace(/\s+/g, '-')}/${post.slug}`}
                                target="_blank"
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview Post</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              <Link href={`/admin/posts/${post.slug}/edit`}>
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Post</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(post.slug, post.title)}
                              disabled={isDeleting === post.slug}
                              className="h-8 w-8 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Post</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {posts.length > 0 && !hidePagination && (
        <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={itemsPerPage} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8 text-xs">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{((currentPage - 1) * effectiveItemsPerPage) + 1}-{Math.min(currentPage * effectiveItemsPerPage, filteredPosts.length)} of {filteredPosts.length}</span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
