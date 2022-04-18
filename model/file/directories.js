import Models from "../../lib/model";

class Directories extends Models {
    constructor() {
        super('local', 'directory', 'directories', [
            'name','level','parent_id','full_path'
        ])
    }

    /**
     * @method hasManyFiles 一个文件夹拥有很多文件
     */
    hasManyFiles(){
        return this.hasMany('files', 'id', 'directory_id');
    }

    /**
     * @method hasManyDirectories 一个文件夹可以拥有多个文件夹
     */
    hasManyDirectories(){
        return this.hasMany(this.table, 'id', 'parent_id');
    }
}

export default Directories;