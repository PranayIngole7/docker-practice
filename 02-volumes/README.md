╔══════════════════════════════════════╗
║          DOCKER VOLUMES              ║
╚══════════════════════════════════════╝

1. Container filesystem
   → Temporary/replaceable

2. Named Volume
   → User chooses name
   → Persistent
   → Good for databases

   Example:
   postgres_data:/var/lib/postgresql

3. Anonymous Volume
   → Docker generates name
   → Persistent
   → Useful for container-specific storage

   Example:
   /app/node_modules

4. Bind Mount
   → Host path → Container path
   → Great for development

   Example:
   ./frontend:/app

5. Volume commands

   docker volume ls
   docker volume create NAME
   docker volume inspect NAME
   docker volume rm NAME
   docker volume prune

6. Important principle

   Container lifecycle
          ≠
   Volume lifecycle

7. PostgreSQL

   Container removed ❌
   Volume remains  ✅
   Database remains ✅

8. Common development pattern

   ./app:/app
   /app/node_modules

   Bind Mount
        +
   Anonymous Volume
        =
   Source code sharing without
   overwriting container dependencies.

