import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { todosApi } from '../api/todos';
import { storage } from '../utils/storage';
import { useUIStore } from '../store/useUIStore';

const TODOS_QUERY_KEY = 'todos';
const LIMIT = 20;

function getTodosQueryKey(filter) {
  return [TODOS_QUERY_KEY, filter];
}

export function useTodosQuery(options = {}) {
  const { todoFilter, setTodoFilter } = useUIStore();
  const filter = options.filter ?? todoFilter;

  const query = useInfiniteQuery({
    queryKey: getTodosQueryKey(filter),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await todosApi.getTodos({
        page: pageParam,
        limit: LIMIT,
        filter,
      });
      const result = data.data;
      storage.setTodosCache({
        todos: result.todos,
        pagination: result.pagination,
        filter,
        page: pageParam,
      });
      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination || {};
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 60 * 1000,
    initialData: () => {
      const cached = storage.getTodosCache();
      if (cached && cached.filter === filter && cached.todos?.length >= 0) {
        return {
          pages: [
            {
              todos: cached.todos,
              pagination: cached.pagination || { page: 1, limit: LIMIT, total: cached.todos.length, totalPages: 1 },
            },
          ],
          pageParams: [cached.page || 1],
        };
      }
      return undefined;
    },
    placeholderData: (previousData) => previousData,
    enabled: options.enabled !== false,
  });

  const todos = query.data?.pages?.flatMap((p) => p.todos) ?? [];
  const pagination = query.data?.pages?.[query.data.pages.length - 1]?.pagination;

  return {
    ...query,
    todos,
    pagination,
    filter,
    setFilter: setTodoFilter,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const { todoFilter } = useUIStore();

  return useMutation({
    mutationFn: ({ title }) => todosApi.createTodo(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => todosApi.updateTodo(id, data),
    onMutate: async ({ id, completed, title }) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });
      const prev = queryClient.getQueriesData({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.setQueriesData(
        { queryKey: [TODOS_QUERY_KEY] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              todos: page.todos.map((t) =>
                t._id === id
                  ? {
                      ...t,
                      ...(completed !== undefined && { completed }),
                      ...(title !== undefined && { title }),
                    }
                  : t
              ),
            })),
          };
        }
      );
      return { prev };
    },
    onError: (err, vars, context) => {
      if (context?.prev) {
        context.prev.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useReorderTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todoIds) => todosApi.reorderTodos(todoIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => todosApi.deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_QUERY_KEY] });
      const prev = queryClient.getQueriesData({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.setQueriesData(
        { queryKey: [TODOS_QUERY_KEY] },
        (old) => {
          if (!old?.pages) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              todos: page.todos.filter((t) => t._id !== id),
              pagination: page.pagination
                ? {
                    ...page.pagination,
                    total: Math.max(0, (page.pagination.total || 0) - 1),
                  }
                : page.pagination,
            })),
          };
        }
      );
      return { prev };
    },
    onError: (err, id, context) => {
      if (context?.prev) {
        context.prev.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}
