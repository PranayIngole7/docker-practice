# Docker Named Volumes

## Commands practiced

docker volume create mydata
docker volume ls
docker volume inspect mydata
docker volume rm mydata

## Mounting a volume

--mount source=mydata,target=/data

## Experiment

1. Create volume
2. Attach it to Container 1
3. Create a file
4. Remove Container 1
5. Attach same volume to Container 2
6. Verify the file still exists

## Key concept

Container can be removed without removing the named volume.

