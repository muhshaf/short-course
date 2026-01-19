import { ApiProperty } from "@nestjs/swagger";

export class GetEventsDto {
    @ApiProperty({
     example: 1000000, description: 'Starting block number to fetch events from' 
    })
  fromBlock: number;

  @ApiProperty({
     example: 1000100, description: 'Starting block number to fetch events from' 
    })
  toBlock: number;
}