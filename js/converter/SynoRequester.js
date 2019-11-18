{
    window.$syno_requester = {
        convert
    };
}
// #include "stdafx.h"
// // 定义本文件处理的请求是DataPacketSyno这个格式的
// #pragma pack(1)
// // Syno所用的数据包格式,有大小端转换代码
// struct DataPacketSyno{
//     char head[2];//0xEF01
//     unsigned int address;//缺省0xFFFFFFFF
//     unsigned char sign;
//     unsigned short len;
//     unsigned char data[140];//命令包中:data[0]是cmd
//     unsigned short sum;
//     //小端转化成大端
//     void convert(){
//         sum+=2;
//         rev(&sum,2);
//         memcpy(data+len,&sum,2);
//         len+=2;
//         rev(&len,2);
//         rev(&address,4);
//     }
//     //大端转化成小端
//     void reconvert(){
//         rev(&address,4);
//         rev(&len,2);
//         len-=2;
//         memcpy(&sum,data+len-(sign==SynoSign::ACK),2);
//         rev(&sum,2);
//     }
// private:
//     void rev(void* field,int size){
//         unsigned char tmp[160];
//         unsigned char* p;
//         p=(unsigned char*)field;
//         memcpy(tmp,p,size);
//         for(int i=0;i<size;i++){
//             p[i]=tmp[size-1-i];
//         }
//     }
// };
// #pragma pack(4)

// // 确认是这个转换器的任务,就看协议选的是不是SYNO
// bool RequestConverterSyno::checkProtocol(DataPacket dataPacket){
//     auto x=getProtocol();
//     return x==SYNO;
// }

// // Karl<2019年5月19日13:21:47>悟:
// // 用异常的好处:
// // 不用if/else而用try/catch
// // 可以分开正常业务逻辑和例外情况,提高可读性
// // 而且不用设计异常情况的返回值


// // 把软件内部指令转化为对应的命令码
// int ToSyno(int cmdCode){
//     if(isFreeRequest){
//         isFreeRequest--;
//         return cmdCode;
//     }
//     switch(cmdCode){
//     case SII(GetRawImage):
//         return __SCC(Syno,GetImage);
//     case SII(UpImage):
//         return __SCC(Syno,UpImage);
//     case SII(GenChar):
//         return __SCC(Syno,GenChar);
//     case SII(RegModel):
//         return __SCC(Syno,RegModel);
//     case SII(StoreChar):
//         return __SCC(Syno,StoreChar);
//     case SII(GetEnrollImage):
//         return __SCC(Syno,GetEnrollImage);
//     case SII(Search):
//         return __SCC(Syno,Search);
//     case SII(ReadIndexTable):
//         return __SCC(Syno,ReadIndexTable);
//     case SII(Match):
//         return __SCC(Syno,Match);
//     case SII(LoadChar):
//         return __SCC(Syno,LoadChar);
//     case SII(DeleteChar):
//         return __SCC(Syno,DeleteChar);
//     case SII(UpChar):
//         return __SCC(Syno,UpChar);
//     case SII(ReadINFPage):
//         return __SCC(Syno,ReadINFPage);
//     case SII(ControlLED):
//         return __SCC(Syno,ControlLED);
//     default:
    //         ASF_ERROR(6);
//         throw 0;
//     }
    // }

// // 求校验和
// void getSum(Request& r){
//     unsigned char* p=(unsigned char*)&r;
//     r.sum=0;
//     for(int i=6;i<6+3+r.len;i++){
//         r.sum+=p[i];
//     }
// }

// // SYNO的转化过程
    // std::vector<DataPacket> RequestConverterSyno::convert(int cmdCode,uint8_t* data,uint16_t len){
//     std::vector<DataPacket> ret;
//     try{
//         cmdCode=ToSyno(cmdCode);
//         auto _=comm.blockQueue.back();
//         _.first=cmdCode;
//         comm.blockQueue.pop_back();
//         comm.blockQueue.push_back(_);
//     } catch(...){
//         return ret;
    //     }

//     Request request;

//     const int headLength=sizeof(request)-sizeof(request.data);
//     const int dataLength=sizeof(request.data);

//     // head & address
//     memcpy(request.head,"\xEF\x01",2);
//     getText(editAddress).Parse("%x",&request.address);

//     // cmd_data = cmdCode + data
//     uint8_t* cmd_data=new uint8_t[len+1];
//     cmd_data[0]=cmdCode;
//     memcpy(cmd_data+1,data,len);
//     len+=1;

//     // len & sign
//     request.len=dataLength;
//     request.sign=SynoSign::Command;

//     uint8_t* p=cmd_data;
//     do{
//         // 如果len不够,就用剩余的len
//         if(len<=dataLength){
//             request.len=len;
//         }

//         // data
    //         memcpy(request.data,p,request.len);
//         p+=request.len;
    //         len-=request.len;

//         // sum
//         getSum(request);
    //         int before_len=request.len;

//         // 大小端转化
//         request.convert();
    //         ret.push_back(DataPacket(&request,headLength+before_len));
//     } while(len>0);
//     delete[] cmd_data;
//     return ret;
// }

// DataPacket RequestConverterSyno::convertData(DataPacket& dataPacket){
//     Request request;
//     DataPacket ret;

//     int len=dataPacket.readSize();
//     uint8_t* data=dataPacket.getPointer();

//     const int headLength=sizeof(request)-sizeof(request.data);
//     const int dataLength=sizeof(request.data);

//     // head & address
//     memcpy(request.head,"\xEF\x01",2);
//     getText(editAddress).Parse("%x",&request.address);

//     // cmd_data = cmdCode + data
//     uint8_t* cmd_data=new uint8_t[dataLength];
//     memcpy(cmd_data,data,min(dataLength,len));

//     // len & sign
//     request.len=dataLength;
//     request.sign=SynoSign::NotEndData;

//     uint8_t* p=cmd_data;

//     // 如果len不够,就用剩余的len
//     if(len<=dataLength){
//         request.len=len;
//         request.sign=SynoSign::EndData;
//     }

//     // data
//     memcpy(request.data,p,request.len);
//     p+=request.len;
//     dataPacket.readData(request.len);

//     // sum
//     getSum(request);
//     int before_len=request.len;

//     // 大小端转化
//     request.convert();
//     ret=DataPacket(&request,headLength+before_len);

//     delete[] cmd_data;
//     return ret;
// }
