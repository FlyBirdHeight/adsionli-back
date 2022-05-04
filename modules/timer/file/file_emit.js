/**
 * README: 本处主要处理文件目录的整理和数据统一
 */
const FileUpdate = [
    {
        /**
         * @description 根据软连接的文件，获取到真实文件路径，然后统计文件大小，然后更新数据库中文件目录内容
         */
        name: "file_directory_update",
        time: 300,
        open: false,
        description: "文件目录内容与数据库内容同步",
        callback: () => {
            
        }
    }
]

export default FileUpdate
