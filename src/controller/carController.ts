import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({log: ['error']});

const createCar = async (request: Request, response: Response) => {
  try {
    const nopol = request.body.nopol;
    const merk_mobil = request.body.merk_mobil;
    const harga_perhari = Number(request.body.harga_perhari);

    const newData = await prisma.car.create({
      data: {
        nopol: nopol,
        merk_mobil: merk_mobil,
        harga_perhari: harga_perhari,
      },
    });

    return response.status(200).json({
      status: true,
      message: `Car has been created`,
      data: newData
    });
  } catch (error) {
    return response
    .status(500)
    .json({
        status: false,
        message: error
    })
  }
}

const readCar = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        const keyword = request.query.keyword?.toString() || "";
        const dataCar = await prisma.car.findMany({

            take: qty,
            skip: (page - 1) * qty,
            where: {
                OR: [
                    { merk_mobil: {contains: keyword}}
                ],
            },
            orderBy: {merk_mobil: "asc"}
        })
        return response
        .status(200)
        .json({
            status: true,
            message: `Car has been loaded`,
            data : dataCar
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

const updateCar = async (request: Request, response: Response) =>{
    try {
        const id = request.params.id

        const nopol = request.body.nopol
        const merk_mobil = request.body.merk_mobil
        const harga_perhari = Number(request.body.harga_perhari)

        const findCar = await prisma.car.findFirst({
            where: {id : Number(id)}
        })

        if (!findCar){
            return response.status(400)
            .json({
                status: false,
                message: `Data car not found`
            })
        }

        const dataCar = await prisma.car.update({
            where: {id: Number(id)},
            data: {
                nopol: nopol || findCar.nopol,
                merk_mobil: merk_mobil || findCar.merk_mobil,
                harga_perhari: harga_perhari || findCar.harga_perhari

            }
        })

        return response.status(200)
        .json({
            status: true,
            message: `Car has been update`,
            data: dataCar
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

const deleteCar = async (request: Request, response: Response) =>{
    try {
        const id = request.params.id

        const findCar = await prisma.car.findFirst({
            where: {id: Number(id)}
        })
        if (!findCar){
            return response.status(400)
            .json({
                status: false,
                message: `Car not found`
            })
        }

        const dataCar = await prisma.car.delete({
            where: {id: Number(id)}
        })
        return response.status(200)
        .json({
            status: true,
            message: `Data car has been delete`
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

export {createCar, readCar, updateCar, deleteCar}