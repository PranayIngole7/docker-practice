Docker Bind Mounts

This directory contains my practical learning and experiments with Docker Bind Mounts.

The goal is to understand:

What a bind mount is
Why bind mounts are useful
How host directories are mounted into containers
--mount syntax
Difference between named volumes and bind mounts
How bind mounts help during application development
Why /app/node_modules can cause problems
When to use bind mounts vs named volumes
1. What Is a Bind Mount?

A Docker Bind Mount connects a specific file or directory on the Docker host to a location inside a container.

The host directory is explicitly specified by us.

Conceptually:

Host Machine
│
└── ./app
      │
      │ Bind Mount
      ↓
Docker Container
│
└── /app


The container can access the files from the host directory through the mounted path.

Unlike a Docker named volume, the storage location is controlled by the host filesystem.

2. Bind Mount vs Named Volume
Named Volume

A named volume is managed by Docker.

Docker
│
└── mydata


Example:

docker volume create mydata


Mount:

--mount source=mydata,target=/data


Docker manages where the volume is physically stored.

Bind Mount

A bind mount uses a specific directory from the host.

Host
│
└── /home/user/my-project
          │
          ↓
      Container
          │
          └── /app


Example:

--mount type=bind,source=/home/user/my-project,target=/app


The host directory is explicitly selected.

3. Main Difference

The easiest way to remember the difference:

Named Volume
    ↓
Docker manages the storage

Bind Mount
    ↓
Host filesystem provides the storage

Feature	Named Volume	Bind Mount
Storage managed by	Docker	Host
Host path specified	No	Yes
Good for database persistence	Yes	Possible
Good for development source code	Usually not the first choice	Yes
Data survives container removal	Yes	Yes, because data belongs to host
Docker manages storage lifecycle	Yes	No
4. Bind Mount Syntax

The recommended explicit syntax is:

--mount type=bind,source=<host-path>,target=<container-path>


Example:

--mount type=bind,source="$(pwd)/app",target=/app


Meaning:

source
   ↓
Host directory

target
   ↓
Directory inside container


So:

Host
./app
  │
  │
  ↓
Container
/app

5. Practical Experiment

We created a simple HTML application:

bind-mount/
├── app/
│   └── index.html
└── README.md


The index.html file contains:

<!DOCTYPE html>
<html>
<head>
    <title>Docker Bind Mount</title>
</head>
<body>
    <h1>Hello from Docker Bind Mount!</h1>
</body>
</html>

6. Running Nginx With a Bind Mount

From the docker-practice repository root:

docker run -d \
  --name bind-demo \
  -p 8080:80 \
  --mount type=bind,source="$(pwd)/volumes/bind-mount/app",target=/usr/share/nginx/html \
  nginx

Command explanation
docker run


Creates and starts a new container.

-d


Runs the container in detached/background mode.

--name bind-demo


Gives the container the name bind-demo.

-p 8080:80


Maps:

Host port 8080
      ↓
Container port 80


This allows us to access Nginx using:

http://localhost:8080

7. Understanding the Bind Mount

The important part is:

--mount type=bind,source="$(pwd)/volumes/bind-mount/app",target=/usr/share/nginx/html


Breakdown:

type=bind
    ↓
This is a bind mount.

source="$(pwd)/volumes/bind-mount/app"
    ↓
Directory on the host machine.

target=/usr/share/nginx/html
    ↓
Directory inside the container.


The final relationship is:

Host
docker-practice/
└── volumes/
    └── bind-mount/
        └── app/
            └── index.html
                    │
                    │ Bind Mount
                    ↓
Container
└── /usr/share/nginx/html/
        └── index.html


Nginx serves files from:

/usr/share/nginx/html


Therefore, Nginx is now serving our host's index.html.

8. Testing the Bind Mount

Open:

http://localhost:8080


The browser should display:

Hello from Docker Bind Mount!


This proves that the Nginx container is accessing the files from our host directory.

9. Live File Change Experiment

One of the biggest advantages of bind mounts is that we can modify files on the host and have the container see the changes.

Change:

<h1>Hello from Docker Bind Mount!</h1>


to:

<h1>Hello from my computer!</h1>


Save the file.

Refresh:

http://localhost:8080


The updated content should appear.

No image rebuild is required.

No container recreation is required.

The flow is:

Edit file on host
       ↓
Host file changes
       ↓
Bind mount
       ↓
Container sees change
       ↓
Nginx serves new content
       ↓
Browser displays change

10. Why Does This Work?

A bind mount makes the host directory available at the specified location inside the container.

Without a bind mount:

Host
└── app/index.html

Container
└── /usr/share/nginx/html/index.html


These are separate filesystems.

Changing the host file would not automatically change the container's file.

With a bind mount:

Host
└── app/
      │
      │
      ↓
Container
/usr/share/nginx/html


The container accesses the host directory through the mount.

11. Mounting Over Existing Container Data

A bind mount can hide files that already exist at the target path in the image.

For example, the Nginx image may contain:

/usr/share/nginx/html/
├── index.html
└── 50x.html


If we mount our host directory:

Host
app/
└── index.html


to:

Container
/usr/share/nginx/html


the mounted directory becomes what we see at that path.

Conceptually:

Before mount:

/usr/share/nginx/html
├── index.html
└── 50x.html


After bind mount:

/usr/share/nginx/html
└── index.html


The original image files are not necessarily deleted. They are hidden behind the mounted directory while the mount is active.

12. Inspecting the Mount

Docker provides docker inspect to investigate container configuration.

Run:

docker inspect bind-demo


This produces a large amount of information.

To focus on the mount information:

docker inspect bind-demo --format '{{json .Mounts}}'


We should find information similar to:

Type: bind

Source:
<path-to>/docker-practice/volumes/bind-mount/app

Destination:
/usr/share/nginx/html


This is useful when debugging containers.

If a container is not seeing expected files, checking its mounts is often a good troubleshooting step.

13. Bind Mount and Application Development

Bind mounts are particularly useful during development.

Suppose we have:

my-project/
├── package.json
├── server.js
└── src/


We can mount the project into a container:

Host
my-project/
    │
    │ Bind Mount
    ↓
Container
/app


Now when we modify:

server.js


on the host, the container can see the updated file.

This avoids rebuilding the Docker image for every source-code change.

14. The /app/node_modules Problem

Bind mounts can create an important issue with Node.js applications.

Suppose the container contains:

/app/
├── package.json
├── server.js
└── node_modules/
    ├── express
    ├── cors
    └── ...


Now suppose we bind mount the host project:

Host
./
   │
   │ Bind Mount
   ↓
Container
/app


The bind mount covers /app.

If the host does not contain the expected:

node_modules/


the container may no longer see its original /app/node_modules.

This can result in errors such as:

Cannot find module 'express'

15. Common Node.js Development Solution

A common Docker development pattern is:

Host source code
       │
       │ Bind Mount
       ↓
Container /app
       │
       └── /app/node_modules
                │
                ↓
              Volume


In other words:

Application source code
    → Bind Mount

node_modules
    → Volume


This allows us to edit source code on the host while keeping container dependencies separate.

This is the same /app/node_modules issue we encountered earlier in our Docker application.

16. When Should I Use a Bind Mount?

Bind mounts are especially useful when the host and container need to share files during development.

Good examples:

Source code
HTML
CSS
JavaScript
Configuration files
Development scripts
Local project directories


Typical pattern:

Developer edits source code
          ↓
      Bind Mount
          ↓
       Container

17. When Should I Use a Named Volume?

Named volumes are usually preferred when Docker should manage persistent application data.

Common examples:

PostgreSQL
MySQL
Redis
Application persistent data


Typical pattern:

Container
    │
    ↓
Named Volume
    │
    ↓
Persistent data


A useful practical rule:

Source code during development → Bind Mount

Database/application data       → Named Volume


This is a guideline, not an absolute rule.

18. Bind Mount Lifecycle

A bind mount uses the host filesystem.

Therefore, removing the container does not remove the host files.

For example:

Host
└── app/
    └── index.html


Container:

Container
└── /usr/share/nginx/html


If we remove the container:

docker rm bind-demo


the host file remains:

Host
└── app/
    └── index.html   ← still exists


Docker did not own that file.

The file belongs to the host filesystem.

19. Cleanup

Stop the container:

docker stop bind-demo


Remove it:

docker rm bind-demo


The host files remain untouched.

Verify the directory:

ls volumes/bind-mount/app


You should still see:

index.html

20. Important Commands Learned
Create a container with a bind mount
docker run -d \
  --name bind-demo \
  -p 8080:80 \
  --mount type=bind,source="$(pwd)/volumes/bind-mount/app",target=/usr/share/nginx/html \
  nginx

Inspect the container
docker inspect bind-demo

Inspect only mounts
docker inspect bind-demo --format '{{json .Mounts}}'

Stop container
docker stop bind-demo

Remove container
docker rm bind-demo

21. Key Takeaways

The most important concepts from this experiment are:

1. Bind mount connects host storage to container storage.

2. source = host path.

3. target = path inside container.

4. Changes on the host can be seen by the container.

5. Bind mounts are very useful during development.

6. Host files survive container removal.

7. Named volumes are managed by Docker.

8. Bind mounts are controlled through explicit host paths.

9. /app/node_modules can be hidden by an /app bind mount.

10. A separate volume can protect node_modules.

22. Quick Comparison
Container filesystem
        ↓
Temporary
        ↓
Destroyed with container


Named volume
        ↓
Docker-managed
        ↓
Good for persistent data


Bind mount
        ↓
Host-managed directory
        ↓
Excellent for development/source code

23. Experiment Summary

The experiment followed this flow:

1. Create host directory
        ↓
2. Create index.html
        ↓
3. Start Nginx container
        ↓
4. Bind mount host directory
        ↓
5. Access localhost:8080
        ↓
6. Edit index.html on host
        ↓
7. Refresh browser
        ↓
8. Container sees updated file
        ↓
9. Remove container
        ↓
10. Host file still exists


This demonstrates the core behavior of Docker Bind Mounts.
