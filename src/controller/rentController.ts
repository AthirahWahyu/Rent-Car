import { PrismaClient } from "@prisma/client";
import { Request, Response, request } from "express";

const prisma = new PrismaClient({log: ['error']});

const createRent = async (request: Request, response: Response ) =>{
    try {
        const car_id = Number(request.body.car_id)
        const nama_penyewa = request.body.nama_penyewa
        const tanggal = new Date(request.body.tanggal).toISOString();
        const lama_sewa = Number(request.body.lama_sewa)

        const car = await prisma.car.findFirst({ where: { id: car_id } })
        if (!car) {
            return response.status(400).json({
                status: false,
                message: "Data car not found"
            })
        }
        const total_bayar = car.harga_perhari * lama_sewa

        const newData = await prisma.rent.create({
            data: {
                car_id: car_id,
                nama_penyewa : nama_penyewa,
                tanggal : tanggal,
                lama_sewa : lama_sewa,
                total_bayar: total_bayar

            }
        })
        return response.status(200).json({
            status: true,
            message: `Rent has been created`,
            data: newData
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
        
    }
}

const readRent = async (request: Request, response: Response) =>{
    try {
        const dataRent = await prisma.rent.findMany()
        return response
        .status(200)
        .json({
            status: true,
            message : `Rent has been loaded`,
            data: dataRent
        })
        
    } catch (error) {
        return response
        .status (500)
        .json({
            status: false,
            message: error
        })
    }
}

const updateRent = async (request: Request, response: Response) => {
    try {
        const id = request.params.id

        const car_id = Number(request.body.car_id)
        const nama_penyewa = request.body.nama_penyewa
        const tanggal = new Date(request.body.tanggal).toISOString()
        const lama_sewa = Number(request.body.lama_sewa)

        const car = await prisma.car.findFirst({ where: { id: car_id } })
        if (!car) {
            return response.status(400).json({
                status: false,
                message: `Data car not found`
            })
        }
        const total_bayar = car.harga_perhari * lama_sewa

        const findRent = await prisma.rent.findFirst({
            where : {id: Number(id)}
        })
        if (!findRent){
            return response
            .status(400)
            .json({
                status: false,
                message: `Data Rent not found`
            })
        }

        const dataRent = await prisma.rent.update({
            where: {id: Number(id)},
            data:{
                car_id: car_id || findRent.car_id,
                nama_penyewa: nama_penyewa || findRent.nama_penyewa,
                tanggal: (tanggal)  || findRent.tanggal,
                lama_sewa: lama_sewa || findRent.lama_sewa,
                total_bayar: total_bayar || findRent.total_bayar
            }
        })
        return response.status(200)
        .json({
            status: true,
            message: `Rent has been update`,
            data: dataRent
        })
        
    } catch (error) {
        return response
        .status(500)
        .json({
            status: false,
            message: error
        })
        
    }
}

const deleteRent = async (request: Request, response: Response) =>{
    try {
        const id = request.params.id

        const findRent = await prisma.rent.findFirst({
            where: {id: Number(id)}
        })

        if (!findRent){
            return response.status(400)
            .json({
                status: false,
                message: `Rent not found`
            })
        }

        const dataRent = await prisma.rent.delete({
            where: {id: Number(id)}
        })
        return response.status(200)
        .json({
            status: true,
            message: `Data Rent has been deleted`
        })
        
    } catch (error) {
        return response
        .status(500)
        .json({
            status: false,
            message: error
        })
        
    }
}

export {createRent, readRent, updateRent, deleteRent}