# file-storage
The solution tackles a file storage task.
The **filestore** folder contains the service project that was made by **Node/Express**.  
The **fileupload** folder contains the client project that was made by **Vue 2**.  
The files are stored in a Microsoft Azure blob storage.
The application was tested only on its local emulator the MS Azurite.  
The Azurite blob storge can be run with the following command:  
**azurite-blob -l d:\data\filestorage --loose**  
With Azurite, the default setup is used in every aspect, but for a blob container, the service creates one with the name of **files**.  
Both projects have an appSettings.json file that describes the programs changable configuration.
