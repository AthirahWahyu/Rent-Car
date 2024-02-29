import { PrismaClient } from "@prisma/client";
import { Request, Response, request, response } from "express";
import md5 from "md5";
import {sign} from "jsonwebtoken"

const prisma = new PrismaClient({log:['error']});

const createAdmin = async (request: Request, response: Response) => {
  try {
    const nama_admin = request.body.nama_admin;
    const email = request.body.email;
    const password = md5(request.body.password);

    const newData = await prisma.admin.create({
      data: {
        nama_admin: nama_admin,
        email: email,
        password: password,
      },
    });
    return response.status(200).json({
      status: true,
      message: `Admin has been created`,
      data: newData,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
    });
  }
};

const readAdmin = async (request: Request, response: Response) => {
  try {
    const page = Number(request.query.page) || 1;
    const qty = Number(request.query.qty) || 5;
    const keyword = request.query.keyword?.toString() || "";
    const dataAdmin = await prisma.admin.findMany({

      take: qty,
      skip: (page - 1) * qty,
      where: {
        OR: [
          {nama_admin:{contains: keyword}},
          {email : {contains: keyword }},
          {password : {contains: keyword}}
        ],
      },
      orderBy : {nama_admin: "asc"}
    })
    return response.status(200).json({
      status: true,
      message: `Admin has been loaded`,
      data: dataAdmin,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

const updateAdmin = async (request: Request, response: Response) => {
  try {
    const id = Number(request.params.id);

    const nama_admin = request.body.nama_admin;
    const email = request.body.email;
    const password = md5(request.body.password);

    const findAdmin = await prisma.admin.findFirst({
      where: { id: Number(id) },
    });

    if (!findAdmin) {
      return response.status(400).json({
        status: false,
        message: `Admin user not found`,
      });
    }

    const dataAdmin = await prisma.admin.update({
      where: { id: Number(id) },
      data: {
        nama_admin: nama_admin || findAdmin.nama_admin,
        email: email || findAdmin.email,
        password: password || findAdmin.password,
      },
    });

    return response.status(200).json({
      status: true,
      message: `Admin has been update`,
      data: dataAdmin
    });
  } catch (error) {
    return response.status(500).json({
        status: false,
        message: error
    })
  }
}

const deleteAdmin = async (request: Request, response: Response) =>{
    try {

        const id = request.params.id

        const findAdmin = await prisma.admin.findFirst({
            where: {id: Number(id)}
        })

        if (!findAdmin){
            return response.status(400)
            .json({
                status: false,
                message: `Admin not found`
            })
        }

        const dataAdmin = await prisma.admin.delete({
            where: {id: Number(id)}
        })

        return response.status(200)
        .json({
            status: true,
            message: `Data Admin has been deleted`
        })
        
    } catch (error) {
        return response.status(500)
        .json({
            status: false,
            message: error
        })
        
    }
}

const login = async (request: Request, response: Response) => {
    try {

        const email = request.body.email
        const password = md5(request.body.password)
        const nama_admin = await prisma.admin.findFirst({
            where: {email: email, password: password }
        })

        if (nama_admin) {
            const payload = nama_admin
            const secretkey = 'ujian'
            const token = sign(payload, secretkey)
            return response 
            .status(200)
            .json({
                status: true,
                message: `login succsess`,
                token : token
            })
        }
        
        else {
            return response
            .status(500)
            .json({
                status: false,
                message : `login was not successful`
            })
        }
    } catch (error) {
        return response
        .status(500)
        .json({
            status: false,
            message: error

        })
        
    }
}

export {createAdmin, readAdmin, updateAdmin, deleteAdmin, login}