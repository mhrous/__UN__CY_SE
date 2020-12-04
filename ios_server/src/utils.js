import {writeFileSync,unlinkSync,readFileSync,existsSync} from "fs"
import {v4 as uuidv4} from 'uuid';
import {DATA_PATH} from "./config"
import chalk from "chalk";

const getFilePath = (fileName) => `${DATA_PATH}/${fileName}.txt`


export const readFile = ({fileName}) => {
    const filePath = getFilePath(fileName)
    const exists =  existsSync(filePath)
    if(!exists){
        return "error"
    }
    const text = readFileSync(filePath,"utf8")
    return {title:fileName,content: text}
}
export const deleteFile = ({fileName}) => {
    const filePath = getFilePath(fileName)
    unlinkSync(filePath)
    return "success"

}
export const updateFile = ({lastFileName , newText,newFileName}) => {
    deleteFile({fileName:lastFileName})
    createFile({text:newText,fileName:newFileName})

}
export const createFile = ({text,fileName=undefined }) => {
    fileName =fileName || uuidv4()
    const filePath = getFilePath(fileName)
    const exists =  existsSync(filePath)
    if(exists){
        return "error"
    }
    writeFileSync(filePath, text)
    return {text, fileName}
    return "success"

}

export const green = chalk.green.bold
export const blue = chalk.blue.bold
export const red = chalk.red.bold
export const emptyLine="\n"
export const line ="-".repeat(75)
